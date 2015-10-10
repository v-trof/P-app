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
		/user* managing
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
	* /search

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