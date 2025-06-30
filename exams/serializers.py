from rest_framework import serializers
from .models import Subject, TestPaper, Question, Option, ExamRecord, AnswerDetail

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'question_no', 'text', 'options']

class TestPaperSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = TestPaper
        fields = ['id', 'title', 'questions']

class SubjectSerializer(serializers.ModelSerializer):
    papers = TestPaperSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ['id', 'name', 'papers']

class AnswerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerDetail
        fields = ['question', 'selected_option', 'is_correct']

class ExamRecordSerializer(serializers.ModelSerializer):
    details = AnswerDetailSerializer(many=True, read_only=True)
    class Meta:
        model = ExamRecord
        fields = ['id', 'user', 'test_paper', 'created_at', 'score', 'total', 'details']
