from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile, Task, Submission, Notification

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
        data['user_id'] = self.user.id
        return data

class UserSerializer(serializers.ModelSerializer):
    role = serializers.ReadOnlyField(source='profile.role')
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = ['username', 'role']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer() # Remove read_only=True

    class Meta:
        model = Profile
        fields = '__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            user.email = user_data.get('email', user.email)
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()
        
        return super().update(instance, validated_data)

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

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
