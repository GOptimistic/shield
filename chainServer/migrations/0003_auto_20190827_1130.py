# Generated by Django 2.2.4 on 2019-08-27 03:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chainServer', '0002_remove_test_age'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='name2',
            field=models.CharField(default=' ', max_length=10),
        ),
        migrations.AlterField(
            model_name='test',
            name='name',
            field=models.CharField(default=' ', max_length=10),
        ),
    ]
