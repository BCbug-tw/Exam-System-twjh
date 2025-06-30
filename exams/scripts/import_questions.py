import csv
from pathlib import Path
from django.conf import settings
from exams.models import Subject, TestPaper, Question, Option

def run():
    csv_path = Path(settings.BASE_DIR) / "questions.csv"
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # 1. 取得或建立 Subject
            subject, _ = Subject.objects.get_or_create(name=row['subject'])

            # 2. 取得或建立 TestPaper
            paper, _ = TestPaper.objects.get_or_create(subject=subject, title=row['testpaper'])

            # 3. 建立 Question (多了 question_no)
            question = Question.objects.create(
                test_paper=paper,
                question_no=int(row['question_no']),
                text=row['question_text'],
                image=row['image'] if row['image'] else None
            )

            # 4. 建立四個選項
            correct = row['correct_option'].upper()
            Option.objects.create(question=question, text=row['option_a'], is_correct=(correct == 'A'))
            Option.objects.create(question=question, text=row['option_b'], is_correct=(correct == 'B'))
            Option.objects.create(question=question, text=row['option_c'], is_correct=(correct == 'C'))
            Option.objects.create(question=question, text=row['option_d'], is_correct=(correct == 'D'))

    print("✅ 匯入完成！")
