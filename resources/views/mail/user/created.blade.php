<x-mail::message>

Hello {{ $user->name }},

your account has been create successfully

** here's your login information: **. <br>

Email: {{ $user->email }} <br>

Password: {{ $password }}

please login to the system and change you password.

<x-mail::button url="{{ route('login') }}">
click here to login
</x-mail::button>

Thank you, <br>
{{ config('app.name') }}

</x-mail::message>
