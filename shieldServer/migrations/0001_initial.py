# Generated by Django 2.2.4 on 2019-08-26 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('uid', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(default='', max_length=255)),
                ('password', models.CharField(default='', max_length=255)),
            ],
        ),
    ]