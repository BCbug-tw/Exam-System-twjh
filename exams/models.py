from django.db import models
from django.conf import settings

class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class TestPaper(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='papers')
    title = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.subject.name} - {self.title}"

class Question(models.Model):
    test_paper = models.ForeignKey(TestPaper, on_delete=models.CASCADE, related_name='questions')
    question_no = models.IntegerField(null=True, blank=True)
    text = models.TextField()
    image = models.ImageField(upload_to='question_images/', null=True, blank=True)

    def __str__(self):
        return self.text[:30]

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class ExamRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    test_paper = models.ForeignKey(TestPaper, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField()
    total = models.IntegerField()

class AnswerDetail(models.Model):
    exam_record = models.ForeignKey(ExamRecord, on_delete=models.CASCADE, related_name='details')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.SET_NULL, null=True)
    is_correct = models.BooleanField()