# -*- coding: utf-8 -*-

from django.db import models


class Host(models.Model):
    ip = models.CharField(max_length=30,null=True)
    biz = models.IntegerField(null=True)
    bk_cloud_id = models.IntegerField(null=True)
    need_poll = models.BooleanField(default=False)


class Server(models.Model):
    host = models.ForeignKey(Host)
    mem = models.CharField(max_length=30, null=True)
    disk = models.CharField(max_length=30, null=True)
    cpu = models.CharField(max_length=30, null=True)
    date_time = models.CharField(max_length=120, null=True)