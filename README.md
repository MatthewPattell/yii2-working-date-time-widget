DayDateTime Widget for Yii2
===========================
Input day/time/dinner widget

Installation
------------

The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

Either run

```
php composer.phar require --prefer-dist matthew-p/yii2-working-date-time-widget "*"
```

or add

```
"matthew-p/yii2-working-date-time-widget": "*"
```

to the require section of your `composer.json` file.


Usage
-----

Once the extension is installed, simply use it in your code by:

```php
<?= \MP\WorkingDatetime\WorkingDays::widget(['name' => 'example']); ?>
```