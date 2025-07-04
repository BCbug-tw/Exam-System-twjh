# Generated by Django 5.2.3 on 2025-06-30 03:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exams', '0003_question_question_no'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ExamRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('score', models.IntegerField()),
                ('total', models.IntegerField()),
                ('test_paper', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exams.testpaper')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AnswerDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_correct', models.BooleanField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exams.question')),
                ('selected_option', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='exams.option')),
                ('exam_record', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='details', to='exams.examrecord')),
            ],
        ),
    ]
