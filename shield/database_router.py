# 多数据库和model路由绑定文件
# 作者：马瑞  创建时间：2019.8.22
from django.conf import settings

DATABASE_MAPPING = settings.DATABASE_APPS_MAPPING


class DatabaseAppsRouter(object):
    """
     A router to control all database operations on models for different
     databases.

    In case an app is not set in settings.DATABASE_APPS_MAPPING, the router
     will fallback to the `default` database.

     Settings example:

     DATABASE_APPS_MAPPING = {'app1': 'db1', 'app2': 'db2'}
     """

    def db_for_read(self, model, **hints):
        """"Point all read operations to the specific database."""
        """将所有读操作指向特定的数据库。"""
        if model._meta.app_label in DATABASE_MAPPING:
            return DATABASE_MAPPING[model._meta.app_label]
        return None

    def db_for_write(self, model, **hints):
        """Point all write operations to the specific database."""
        """将所有写操作指向特定的数据库。"""
        if model._meta.app_label in DATABASE_MAPPING:
            return DATABASE_MAPPING[model._meta.app_label]
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """Allow any relation between apps that use the same database."""
        """允许使用相同数据库的应用程序之间的任何关系"""
        db_obj1 = DATABASE_MAPPING.get(obj1._meta.app_label)
        db_obj2 = DATABASE_MAPPING.get(obj2._meta.app_label)
        if db_obj1 and db_obj2:
            if db_obj1 == db_obj2:
                return True
            else:
                return False
        else:
            return None

    def allow_syncdb(self, db, model):
        """Make sure that apps only appear in the related database."""
        """确保这些应用程序只出现在相关的数据库中。"""
        if db in DATABASE_MAPPING.values():
            return DATABASE_MAPPING.get(model._meta.app_label) == db
        elif model._meta.app_label in DATABASE_MAPPING:
            return False
        return None

    def allow_migrate(self, db, app_label, model=None, **hints):
        """Make sure the auth app only appears in the 'auth_db' database."""
        """确保身份验证应用程序只出现在“authdb”数据库中。"""
        if db in DATABASE_MAPPING.values():
            return DATABASE_MAPPING.get(app_label) == db
        elif app_label in DATABASE_MAPPING:
            return False
        return None
