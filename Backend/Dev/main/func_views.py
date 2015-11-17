from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template import RequestContext

def login(request):
        email = request.POST.get('email', False)
        password = request.POST.get('password', False)
        from django.contrib.auth import authenticate
        user = authenticate(username=email, password=password)
        print(email, password)
        if user is not None:
                if user.is_active:
                        return render(request,'Pages/home.html')
                else:
                        print("The password is valid, but the account has been disabled!")
        else:
                print("The username and password were incorrect.")
                return render(request,'Pages/login.html')

def reg(request):
        name = request.POST.get('name_last_name', False)
        email = request.POST.get('email', False)
        password = request.POST.get('password', False)   
        from django.contrib.auth.models import User
        user = User.objects.create_user(name, email, password)
        user.save()
        return render(request,'Pages/home.html')