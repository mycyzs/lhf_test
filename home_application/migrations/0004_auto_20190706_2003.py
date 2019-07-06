# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_application', '0003_auto_20190706_1215'),
    ]

    operations = [
        migrations.RenameField(
            model_name='host',
            old_name='age',
            new_name='ip',
        ),
        migrations.RemoveField(
            model_name='host',
            name='name',
        ),
        migrations.RemoveField(
            model_name='host',
            name='text',
        ),
        migrations.RemoveField(
            model_name='host',
            name='when_created',
        ),
        migrations.RemoveField(
            model_name='server',
            name='background_img',
        ),
        migrations.AddField(
            model_name='host',
            name='biz',
            field=models.ImageField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='host',
            name='bk_cloud_id',
            field=models.ImageField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='host',
            name='need_poll',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='server',
            name='cpu',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='server',
            name='date_time',
            field=models.CharField(max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='server',
            name='disk',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='server',
            name='mem',
            field=models.CharField(max_length=30, null=True),
        ),
    ]
