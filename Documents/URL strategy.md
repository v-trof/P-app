#URL types
* home
	* /profile
		* /settings
	* /course
		* /`id`
		* /`name` 
			* /file
				* /download
	* /test/`id`
	* /panel
		/user-managing
	* /create
		* /import
			* /test
			* /course
			* /package-manager
		* /test
		* /course
		* /material
		* /homework
		* /user
			* /bach
			* /token
	* /login
		* /sign-up
	* /recover

|URL|Expected content and actions|Expected user
|---|---|---|
|/home|list of courses and updates|student|
|/home|updates and link to control panel|teacher|
|/profile|profile info|any|
|/profile/settings|edit profile info or proferences|any|
|/course|browse course contents|student|
|/course|course editing|teacher|
|/course/file|browse some maetrial|student|
|/course/file|edit some material|student|
|/course/file/download|Download that file|any|
|/test|Take a test|student|
|/test|Results or edit|teacher|
|/panel|_HELP-me-to-comment-this-properly_|teacher|
|/panel/user-managing|_HELP-me-to-comment-this-properly_|teacher|
|/create|list of createble items|teacher|
|/create/import|import moodle or P file|teacher|
|/create/`test\course\material`|create something(editor with nothing)|teacher|
|/create/homework|set a timeout for a tesk, students will be notified|teacher|
|/create/user|manually sign up new student|teacher|
|/create/user/bach|_HELP-me-to-comment-this-properly_|teacher|
|/create/user/token|generate unic registation token, may have pre-filled info|teacher|
|/login|login screen|any|
|/sign-up|sign up screen|any|
|/recover|recover acess to lost accout, recover password\email|any|

