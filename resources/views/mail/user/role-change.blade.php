<x-mail::message>

Hello {{ $user->name }},

@if ($user->is_admin)
your are now admin in the system. you can add and block users
@else
your role was changed into regular user. you are no longer able to add and block users
@endif

<br>

Thank you, <br>
{{ config('app.name') }}

</x-mail::message>
