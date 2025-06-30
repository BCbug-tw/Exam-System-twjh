from django.urls import path
from .views import SubjectListView, SubmitExamView, TestPaperDetailView, QuestionDetailView, MyHistoryView

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('submit/', SubmitExamView.as_view(), name='submit-exam'),
    path('papers/<int:pk>/', TestPaperDetailView.as_view(), name='paper-detail'),
    path('history/', MyHistoryView.as_view(), name='my-history'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
]   
