<x-mail::message>

Hello {{ $user->name }},
@if ($user->blocked_at)
your account has been suspended. you are no longer able to login
@else
your account has been activated. you can now normally use the system
<x-mail::button url="{{ route('login') }}">
click here to login
</x-mail::button>
@endif

Thank you, <br>
{{ config('app.name') }}

</x-mail::message>
