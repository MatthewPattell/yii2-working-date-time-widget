DayDateTime Widget for Yii2
===========================
Input day/time/dinner widget

Installation
------------

The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

![Sample](https://github.com/MatthewPattell/yii2-working-date-time-widget/blob/master/sample.png?raw=true "Example screenshot")

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

**Options:**
```php
WorkingDays::widget([
    'name' => 'example',
    
    'roundTheClock' => '00.00 - 00.00', // Default - 00.00 - 00.00. Round-The-Clock value
    'enableDinner' => true,             // Default - true. Enable/disable dinner input
    
    'autocompleteDays' => [],           // Default - []. Automatic filling of time for the specified days
                                        // Example: [1,2,5] or ['monday', 'friday']
                                        // Warning: FILLS TIME FROM THE FILLED DAY
])
```

If you dynamic add widget to page, run (js):
```js
MPWorkingDays.reInit(); // Set default settings only for NEW widgets
```
or
```js
MPWorkingDays.reInit({newId: 'oldId'}); // Copy settings from previous widget
```
or
```js
MPWorkingDays.reInit({newId: {settings...}}); // Set new widget settings
```

Set dynamicaly widget settings:
```js
MPWorkingDays.addInputSettings(widgetID, {settings...});
```