<?php 
/**
 * @package   ImpressPages
 * @copyright Copyright (C) 2011 ImpressPages LTD.
 * @license   GNU/GPL, see ip_license.html
 */

namespace Modules\standard\content_management\Widgets\text_photos\text_title;   
 
if (!defined('CMS')) exit;

class Config // extends MimeType
{
  static function getLayouts()
  {
    global $parametersMod;
    $layouts = array();
    $layouts[] = array('translation'=>$parametersMod->getValue('standard', 'content_management', 'widget_text_title', 'layout_default'), 'name'=>'default');
    return $layouts;
  }

  static function getMceInit(){
    global $site;
    $site->requireConfig('standard/content_management/config.php');
    return \Modules\standard\content_management\Config::getMceInit();
  }
}