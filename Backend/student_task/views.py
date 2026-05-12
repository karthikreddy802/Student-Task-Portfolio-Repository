from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User
from .models import Profile, Task, Submission, Notification
from .serializers import MyTokenObtainPairSerializer, ProfileSerializer, TaskSerializer, SubmissionSerializer, NotificationSerializer
from .ai_service import generate_portfolio_content
from django.http import HttpResponse

def api_root(request):
    return HttpResponse("<h1>Student Task & Portfolio Repository</h1><p>The backend is running. Access the frontend at <a href='http://localhost:5173'>http://localhost:5173</a></p>")

def send_login_email(user):
    subject = 'Login Notification - Student Task Repo'
    message = f'Hi {user.username},\n\nYou have successfully logged into the Smart Academic Portfolio & Repository Platform.\n\nIf this wasn\'t you, please change your password immediately.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    try:
        send_mail(subject, message, email_from, recipient_list)
    except Exception as e:
        print(f"Failed to send email: {e}")

def send_welcome_email(user):
    subject = 'Welcome to Smart Academic Portfolio!'
    message = f'Hi {user.username},\n\nWelcome to the Smart Academic Portfolio & Repository Platform. Your account has been successfully created.\n\nYou can now log in and start managing your assignments and portfolio.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    try:
        send_mail(subject, message, email_from, recipient_list)
    except Exception as e:
        print(f"Failed to send email: {e}")

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = request.data.get('username')
            user = User.objects.get(username=username)
            send_login_email(user)
        return response

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    permission_classes = [permissions.AllowAny] # In production, use IsAuthenticated

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().order_by('-submitted_at')
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # In a real app, we would set student=self.request.user
        # For now, we allow passing student ID in request
        serializer.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'Graded':
            Notification.objects.create(
                user=instance.student,
                title="Submission Graded!",
                message=f"Your submission for '{instance.task.title}' has been graded. Grade: {instance.grade}"
            )

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # In production, return only notifications for the current user
        user_id = self.request.query_params.get('user_id')
        if user_id and user_id.isdigit():
            return self.queryset.filter(user_id=user_id)
        # If user_id is 'undefined' or missing, return empty queryset to avoid error
        if user_id:
            return self.queryset.none()
        return self.queryset

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        id_number = request.data.get('id_number')
        department = request.data.get('department')

        if not username or not password or not email or not id_number:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        Profile.objects.create(user=user, role='Student', id_number=id_number, department=department)
        
        send_welcome_email(user)
        
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

class GeneratePortfolioView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        submission_ids = request.data.get('submission_ids', [])
        student_name = request.data.get('student_name', 'Student')
        
        if not submission_ids:
            return Response({'error': 'No submissions selected'}, status=status.HTTP_400_BAD_REQUEST)
            
        submissions = Submission.objects.filter(id__in=submission_ids)
        submissions_data = []
        for s in submissions:
            submissions_data.append({
                'id': s.id,
                'task_title': s.task.title,
                'description': s.description,
                'tags': s.tags,
                'grade': s.grade
            })
            
        result = generate_portfolio_content(student_name, submissions_data)
        
        if result:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'AI Generation failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
