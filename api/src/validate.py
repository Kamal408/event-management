import re
from datetime import datetime, timedelta

def isValidDateTimeFormat(date_str):
    pattern_str = r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$'
    
    if re.match(pattern_str, str(date_str)):
        return True
    
    return False

def isValidDateFormat(date_str):
    pattern_str = r'^\d{4}-\d{2}-\d{2}$'
    
    if re.match(pattern_str, str(date_str)):
        return True
    
    return False


def getStartAndEndDateForMonth(date_str):
    date_object = datetime.strptime(date_str, '%Y-%m-%d')
    
    start = date_object.replace(day=1)
    
    next_month = start.replace(month=start.month + 1)
    end = next_month - timedelta(seconds=1)

    return start, end

