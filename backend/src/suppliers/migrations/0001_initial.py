# Generated by Django 4.2 on 2025-06-14 12:39

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NhaCungCapModel',
            fields=[
                ('MaNCC', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('TenNCC', models.CharField(max_length=100)),
                ('SoDienThoai', models.CharField(blank=True, max_length=15)),
            ],
        ),
    ]
