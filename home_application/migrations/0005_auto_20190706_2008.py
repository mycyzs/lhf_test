# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_application', '0004_auto_20190706_2003'),
    ]

    operations = [
        migrations.AlterField(
            model_name='host',
            name='biz',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='host',
            name='bk_cloud_id',
            field=models.IntegerField(null=True),
        ),
    ]
