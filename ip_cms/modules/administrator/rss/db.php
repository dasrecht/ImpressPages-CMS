<?php
/**
 * @package	ImpressPages
 * @copyright	Copyright (C) 2011 ImpressPages LTD.
 * @license	GNU/GPL, see ip_license.html
 */
namespace Modules\administrator\rss;
if (!defined('FRONTEND')&&!defined('BACKEND')) exit;

class Db{
  function __construct(){
  }
  
  public static function updateRss($languageId, $zoneKey, $elementId, $newRss){
		if($languageId != null && $zoneKey!= null && $elementId != null){
			$sql = "delete from `".DB_PREF."m_administrator_rss` where language_id = '".$languageId."' and zone_key = '".$zoneKey."' and element_id = '".$elementId."' ";
			$sql2 = "insert into `".DB_PREF."m_administrator_rss` set language_id = '".$languageId."', zone_key = '".$zoneKey."', element_id = '".$elementId."', rss =  '".mysql_real_escape_string($newRss)."' ";
		}elseif($languageId != null && $zoneKey != null){
			$sql = "delete from `".DB_PREF."m_administrator_rss` where language_id = '".$languageId."' and zone_key = '".$zoneKey."' and element_id is NULL ";
			$sql2 = "insert into `".DB_PREF."m_administrator_rss` set language_id = '".$languageId."', zone_key = '".$zoneKey."', element_id = NULL, rss =  '".mysql_real_escape_string($newRss)."' ";
		}else{
			$sql = "delete from `".DB_PREF."m_administrator_rss` where language_id = '".$languageId."' and zone_key is NULL and element_id is NULL ";
			$sql2 = "insert into `".DB_PREF."m_administrator_rss` set language_id = '".$languageId."', zone_key = NULL, element_id = NULL, rss =  '".mysql_real_escape_string($newRss)."' ";
		}
		$rs = mysql_query($sql);
		if(!$rs)
			trigger_error($sql." ".mysql_error());
		else{
			$rs2 = mysql_query($sql2);
			if(!$rs2)
				trigger_error($sql2." ".mysql_error());
		}
	}

	public static function getRss($languageId, $zoneKey, $elementId){
		global $parametersMod;
		if($languageId != null && $zoneKey != null && $elementId != null){ 
			$sql = "select rss from `".DB_PREF."m_administrator_rss` where language_id = '".$languageId."' and zone_key = '".$zoneKey."' and element_id = '".$elementId."' and ".((int)$parametersMod->getValue('administrator', 'rss', 'options', 'update_speed'))." > TIMESTAMPDIFF(MINUTE,`created_on`,NOW())";
		}elseif($languageId != null && $zoneKey != null){
			$sql = "select rss from `".DB_PREF."m_administrator_rss` where language_id = '".$languageId."' and zone_key = '".$zoneKey."' and element_id is NULL  and ".((int)$parametersMod->getValue('administrator', 'rss', 'options', 'update_speed'))." > TIMESTAMPDIFF(MINUTE,`created_on`,NOW())";
		}else{
			$sql = "select rss from `".DB_PREF."m_administrator_rss` where language_id is NULL and zone_key is NULL and element_id is NULL  and ".((int)$parametersMod->getValue('administrator', 'rss', 'options', 'update_speed'))." > TIMESTAMPDIFF(MINUTE,`created_on`,NOW())";
		}
		$rs = mysql_query($sql);
		if($rs){
			if($lock = mysql_fetch_assoc($rs)){
				return $lock['rss'];				
			}else
				return false;
		}else
			trigger_error($sql." ".mysql_error());
	}
	
	public static function deleteOldRss(){
		$sql = "delete from `".DB_PREF."m_administrator_rss` where 1 < TIMESTAMPDIFF(MONTH,`created_on`,NOW())";
		$rs = mysql_query($sql);
		if(!$rs)
			trigger_error($sql." ".mysql_error());
	}

	public static function clearCache(){
		$sql = "delete from `".DB_PREF."m_administrator_rss` where 1";
		$rs = mysql_query($sql);
		if(!$rs)
			trigger_error($sql." ".mysql_error());
	}  
}

