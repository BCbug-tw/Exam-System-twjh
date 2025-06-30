from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Subject, ExamRecord, AnswerDetail, TestPaper, Question, Option
from .serializers import SubjectSerializer, ExamRecordSerializer, TestPaperSerializer
from django.http import JsonResponse

# ✅ 自動回傳 subjects 與其 papers
class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class TestPaperDetailView(generics.RetrieveAPIView):
    queryset = TestPaper.objects.all()
    serializer_class = TestPaperSerializer

class QuestionDetailView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = TestPaperSerializer

'''class ResultView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExamRecordSerializer

    def get(self, request, *args, **kwargs):
        exam_record_id = kwargs.get('pk')
        try:
            exam_record = ExamRecord.objects.get(id=exam_record_id, user=request.user)
        except ExamRecord.DoesNotExist:
            return Response({"error": "Exam record not found"}, status=status.HTTP_404_NOT_FOUND)

        details = []
        for detail in exam_record.details.all():
            correct_option = detail.question.options.get(is_correct=True)
            details.append({
                "question": detail.question.question_no,
                "selectedOptionId": detail.selected_option.id if detail.selected_option else None,
                "selectedOptionText": detail.selected_option.text if detail.selected_option else None,
                "correctOptionId": correct_option.id,
                "correctOptionText": correct_option.text,
                "is_correct": detail.is_correct
            })

        return Response({
            "id": exam_record.id,
            "test_paper_id": exam_record.test_paper.id,
            "score": exam_record.score,
            "total": exam_record.total,
            "details": details
        })'''

class SubmitExamView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        test_paper_id = request.data.get('test_paper')
        answers = request.data.get('answers')

        if not test_paper_id or not answers:
            return Response({"error": "需要 test_paper 與 answers"}, status=status.HTTP_400_BAD_REQUEST)

        test_paper = TestPaper.objects.get(id=test_paper_id)
        total = test_paper.questions.count()
        score = 0

        exam_record = ExamRecord.objects.create(user=user, test_paper=test_paper, total=total, score=0)

        for question_id, selected_option_id in answers.items():
            question = Question.objects.get(id=question_id)
            selected_option = Option.objects.get(id=selected_option_id)
            correct_option = question.options.get(is_correct=True)
            is_correct = selected_option.id == correct_option.id
            if is_correct:
                score += 1
            AnswerDetail.objects.create(
                exam_record=exam_record,
                question=question,
                selected_option=selected_option,
                is_correct=is_correct
            )

        exam_record.score = score
        exam_record.save()

        details = []
        for detail in exam_record.details.all():
            question = detail.question
            correct_option = question.options.get(is_correct=True)
            options = question.options.all()
            all_options_data = [{"id": opt.id, "text": opt.text} for opt in options]

            details.append({
                "question": question.question_no,
                "selectedOptionId": detail.selected_option.id if detail.selected_option else None,
                "selectedOptionText": detail.selected_option.text if detail.selected_option else None,
                "correctOptionId": correct_option.id,
                "correctOptionText": correct_option.text,
                "allOptions": all_options_data,
                "is_correct": detail.is_correct
            })

        return Response({
            "id": exam_record.id,
            "test_paper_id": test_paper.id,
            "score": exam_record.score,
            "total": exam_record.total,
            "details": details
        })
    
class MyHistoryView(generics.ListAPIView):
    serializer_class = ExamRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ExamRecord.objects.filter(user=self.request.user).order_by('-created_at')