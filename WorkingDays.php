<?php
/**
 * Created by PhpStorm.
 * User: Yarmaliuk Mikhail
 * Date: 20.10.2017
 * Time: 17:00
 */

namespace MP\WorkingDateTime;

use Yii;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\web\View;
use yii\widgets\InputWidget;

/**
 * Class    WorkingDays
 * @package MP\WorkingDateTime
 * @author  Yarmaliuk Mikhail
 * @version 1.0
 */
class WorkingDays extends InputWidget
{
    const FULL_DAY = '00.00 - 00.00';

    /**
     * Enable dinner input
     *
     * @var bool
     */
    public $enableDinner = true;

    /**
     * @var string|array
     */
    public $value;

    /**
     * @inheritdoc
     * @return void
     */
    public function init()
    {
        if (empty($this->options['id'])) {
            $this->options['id'] = $this->getId();
        }

        $this->value = $this->hasModel() ? Html::getAttributeValue($this->model, $this->attribute) : $this->value;

        if (is_string($this->value)) {
            $this->value = json_decode($this->value, true);
        }
    }

    /**
     * Get input
     *
     * @inheritdoc
     * @return string
     */
    public function run()
    {
        $this->registerAssets();

        if ($this->hasModel()) {
            $inputName = Html::getInputName($this->model, $this->attribute);
        } else {
            $inputName = $this->name;
        }

        $input = Html::beginTag('div', ['id' => $this->options['id'], 'class' => 'working-days']);

        foreach ($this->getDays() as $dayAlias => $dayTitle) {
            $val1       = !empty($this->value[$dayAlias]['work']) && $this->value[$dayAlias]['work'] !== self::FULL_DAY ? $this->value[$dayAlias]['work'] : NULL;
            $day_status = empty($this->value[$dayAlias]['work']) && empty($this->value[$dayAlias]['dinner']) ? 'inactive' : 'active';

            $input .= Html::beginTag('div', ['class' => 'option ' . $day_status]);
            $input .= Html::beginTag('div', ['class' => 'option-row']);

            $input .= Html::tag('div', $dayTitle, ['class' => 'name', 'title' => Yii::t('app', 'Нажмите, чтобы активировать')]);
            $input .= Html::beginTag('div', ['class' => 'value']);

            // Masked input
            $input .= Html::textInput(NULL, $val1, ['class' => 'form-control time-work ' . ($val1 ? 'active' : 'inactive'), 'placeholder' => Yii::t('app', 'Раб.: круглосуточно')]);
            // Real input
            $input .= Html::textInput($inputName . '[' . $dayAlias . '][work]', !empty($this->value[$dayAlias]['work']) ? $this->value[$dayAlias]['work'] : NULL, ['class' => 'hide realW']);

            if ($this->enableDinner) {
                $val2 = !empty($this->value[$dayAlias]['dinner']) && $this->value[$dayAlias]['dinner'] !== self::FULL_DAY ? $this->value[$dayAlias]['dinner'] : NULL;

                // Masked input
                $input .= Html::textInput($inputName . '[' . $dayAlias . '][dinner]', $val2, ['class' => 'form-control time-dinner ' . ($val2 ? 'active' : 'inactive'), 'placeholder' => Yii::t('app', 'Обед: без обеда')]);
                // Real input
                $input .= Html::textInput($inputName . '[' . $dayAlias . '][dinner]', !empty($this->value[$dayAlias]['dinner']) ? $this->value[$dayAlias]['dinner'] : NULL, ['class' => 'hide realD']);
            }

            $input .= Html::endTag('div');
            $input .= Html::endTag('div');
            $input .= Html::endTag('div');
        }

        $input .= Html::endTag('div');

        return $input;
    }

    /**
     * Get week days
     *
     * @return array
     */
    public function getDays()
    {
        return [
            'monday'    => Yii::t('app', 'Понедельник'),
            'tuesday'   => Yii::t('app', 'Вторник'),
            'wednesday' => Yii::t('app', 'Среда'),
            'thursday'  => Yii::t('app', 'Четверг'),
            'friday'    => Yii::t('app', 'Пятница'),
            'saturday'  => Yii::t('app', 'Суббота'),
            'sunday'    => Yii::t('app', 'Воскресенье'),
        ];
    }

    /**
     * Register widget assets
     *
     * @return void
     */
    private function registerAssets()
    {
        WorkingDaysAsset::register($this->view);

        $options = [
            'fullDay'      => self::FULL_DAY,
            'enableDinner' => $this->enableDinner,
        ];

        $this->view->registerJs("MPWorkingDays.init();", View::POS_READY, 'MPWorkingDays');
        $this->view->registerJs("MPWorkingDays.addInputSettings('{$this->options['id']}', " . Json::encode($options) . ")");
    }
}