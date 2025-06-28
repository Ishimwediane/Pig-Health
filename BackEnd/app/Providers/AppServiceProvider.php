
<?php
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Only needed when using php artisan serve and Authorization headers are missing
        if (isset($_SERVER['HTTP_AUTHORIZATION']) && !request()->hasHeader('Authorization')) {
            request()->headers->set('Authorization', $_SERVER['HTTP_AUTHORIZATION']);
        }
    }

    public function register()
    {
        //
    }
}
