# Generated by Django 4.2 on 2025-06-14 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medicine_types', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loaithuocmodel',
            name='DonViTinh',
            field=models.CharField(choices=[('viên', 'Viên'), ('lọ', 'Lọ'), ('ống', 'Ống'), ('chai', 'Chai'), ('hộp', 'Hộp'), ('gói', 'Gói')], default='viên', max_length=10),
        ),
    ]
