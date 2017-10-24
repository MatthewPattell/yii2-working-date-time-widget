<?php
/**
 * Created by PhpStorm.
 * User: Yarmaliuk Mikhail
 * Date: 20.10.2017
 * Time: 17:00
 */

namespace MP\WorkingDateTime;

use yii\web\AssetBundle;
use yii\widgets\MaskedInputAsset;

/**
 * Class    WorkingDaysAsset
 * @package MP\WorkingDateTime
 * @author  Yarmaliuk Mikhail
 * @version 1.0
 */
class WorkingDaysAsset extends AssetBundle
{
    /**
     * @var array
     */
    public $css = [
        'working-days.css',
    ];

    /**
     * @var array
     */
    public $js = [
        'working-days.js',
    ];

    /**
     * @var array
     */
    public $depends = [
        'yii\web\JqueryAsset',
        'yii\widgets\MaskedInputAsset',
    ];

    /**
     * @inheritdoc
     * @return void
     */
    public function init()
    {
        $this->sourcePath = __DIR__ . '/assets';

        parent::init();
    }
}
