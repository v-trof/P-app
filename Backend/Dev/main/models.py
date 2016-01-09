from django.db import models

from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, UserManager
)
from django.contrib import auth
from django.contrib.auth.hashers import (
    check_password, is_password_usable, make_password,
)
from django.contrib.auth.signals import user_logged_in
from django.contrib.contenttypes.models import ContentType

from django.core import validators
from django.core.exceptions import PermissionDenied
from django.core.mail import send_mail

from django.utils import six, timezone
from django.utils.crypto import get_random_string, salted_hmac
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _
from django import forms


class RegForm(forms.Form):
    email = models.EmailField(_('email address'), blank=True)
    password = forms.CharField(widget=forms.PasswordInput(render_value=False), max_length=100)
    username = models.CharField(_('username'), max_length=30, unique=True)

class LoginForm(forms.Form):
    name = models.EmailField(_('email address'), blank=True)
    email = models.EmailField(_('email address'), blank=True)
    password = forms.CharField(widget=forms.PasswordInput(render_value=False), max_length=100)

class FileForm(forms.Form):
    file = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes'
    )

class Course():
    name = models.CharField(_('name'), max_length=30, blank=True)
    link = models.CharField(_('link'), max_length=30, blank=True)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        _('username'), max_length=30, unique=True,
        help_text=_('Required. 30 characters or fewer. Letters, digits and \@/./+/-/_ only.'),
        validators=[
            validators.RegexValidator(
                r'^[\w.@+-]+$',
                _('Enter a valid username. This value may contain only letters, numbers and @/./+/-/_ characters.'), 'invalid'),
        ],
        error_messages={
            'unique': _("The username already exists"),
        }
    )
    name = models.CharField(_('name'), max_length=30, blank=True)
    Skype = models.CharField(_('skype'), max_length=30, blank=True)
    Codeforces = models.CharField(_('codeforces'), max_length=30, blank=True)
    VK = models.CharField(_('vk'), max_length=30, blank=True)
    Facebook = models.CharField(_('facebook'), max_length=30, blank=True)
    Dnevnik = models.CharField(_('dnevnik'), max_length=30, blank=True)
    avatar = models.CharField(_('dnevnik'), max_length=120, blank=True)
    is_changing = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    email = models.EmailField(_('email address'), blank=True,unique=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    is_active = models.BooleanField(_('active'), default=True)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user.
        """
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)
