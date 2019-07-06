# -*- coding: utf-8 -*-
"""
celery 任务示例

本地启动celery命令: python  manage.py  celery  worker  --settings=settings
周期性任务还需要启动celery调度命令：python  manage.py  celerybeat --settings=settings
"""
import datetime

from celery import task
from celery.schedules import crontab
from celery.task import periodic_task

from common.log import logger
from home_application.cmdb_script import install_mysql_by_script
from home_application.models import Host, Server


@task()
def async_task(x, y):
    """
    定义一个 celery 异步任务
    """
    logger.error(u"celery 定时任务执行成功，执行结果：{:0>2}:{:0>2}".format(x, y))
    return x + y


def execute_task():
    """
    执行 celery 异步任务

    调用celery任务方法:
        task.delay(arg1, arg2, kwarg1='x', kwarg2='y')
        task.apply_async(args=[arg1, arg2], kwargs={'kwarg1': 'x', 'kwarg2': 'y'})
        delay(): 简便方法，类似调用普通函数
        apply_async(): 设置celery的额外执行选项时必须使用该方法，如定时（eta）等
                      详见 ：http://celery.readthedocs.org/en/latest/userguide/calling.html
    """
    now = datetime.datetime.now()
    logger.error(u"celery 定时任务启动，将在60s后执行，当前时间：{}".format(now))
    # 调用定时任务
    async_task.apply_async(args=[now.hour, now.minute], eta=now + datetime.timedelta(seconds=60))


@periodic_task(run_every=crontab(minute='*/5', hour='*', day_of_week="*"))
def get_time():
    """
    celery 周期任务示例

    run_every=crontab(minute='*/5', hour='*', day_of_week="*")：每 5 分钟执行一次任务
    periodic_task：程序运行时自动触发周期任务
    """
    execute_task()
    now = datetime.datetime.now()
    logger.error(u"celery 周期任务调用成功，当前时间：{}".format(now))


@periodic_task(run_every=crontab(minute='*/2', hour='*', day_of_week="*"))
def get_host_data():
    try:
        hosts = Host.objects.filter(need_poll=True)
        for host in hosts:
            username = 'admin'
            app_id = host.biz
            app_list = [{'ip': host.ip, 'bk_cloud_id': host.bk_cloud_id}]
            script_content = """
                    #!/bin/bash
                    MEMORY=$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2 }')
                    DISK=$(df -h | awk '$NF=="/"{printf "%s", $5}')
                    CPU=$(top -bn1 | grep load | awk '{printf "%.2f%%", $(NF-2)}')
                    DATE=$(date "+%Y-%m-%d %H:%M:%S")
                    echo -e "$DATE|$MEMORY|$DISK|$CPU" 
                    """
            result = install_mysql_by_script(username, app_id, app_list, script_content)
            if result['result']:
                data = result['data'][0]['log_content']

                date_time = data.split("|")[0],
                mem = data.split("|")[1],
                disk = data.split("|")[2],
                cpu = data.split("|")[3],

                Server.objects.create(host=host, mem=mem,disk=disk, cpu=cpu, date_time=date_time)
    except Exception as e:
        print e