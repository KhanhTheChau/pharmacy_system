# Generated by Django 4.2 on 2025-06-11 02:58

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='HangSXModel',
            fields=[
                ('MaHangSX', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('TenHangSX', models.CharField(blank=True, max_length=100)),
                ('QuocGia', models.CharField(blank=True, max_length=50)),
            ],
        ),
    ]
