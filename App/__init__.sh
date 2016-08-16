gnome-terminal -x sh -c  "cd main/python/builder; python3 __init__.py; bash"
gnome-terminal -x sh -c "python3 manage.py runserver; bash"
gnome-terminal -x sh -c  "cd Gulp; gulp; bash"