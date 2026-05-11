from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile, Task, Submission

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.profile.role if hasattr(user, 'profile') else 'Student'
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.profile.role if hasattr(self.user, 'profile') else 'Student'
        data['username'] = self.user.username
        return data

class UserSerializer(serializers.ModelSerializer):
    role = serializers.ReadOnlyField(source='profile.role')
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')
    task_title = serializers.ReadOnlyField(source='task.title')
    
    class Meta:
        model = Submission
        fields = '__all__'
