# Generated by Django 4.2 on 2025-07-21 11:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hoadonmodel',
            name='NgayLap',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Ngày lập hóa đơn'),
        ),
    ]
