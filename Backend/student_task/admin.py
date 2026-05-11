from django.contrib import admin
from .models import Profile, Task, Submission

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'id_number', 'department')
    list_filter = ('role', 'department')
    search_fields = ('user__username', 'id_number')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'due_date', 'status')
    list_filter = ('status',)
    search_fields = ('title',)

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'task', 'submitted_at', 'grade')
    list_filter = ('grade',)
    search_fields = ('student__username', 'task__title')
