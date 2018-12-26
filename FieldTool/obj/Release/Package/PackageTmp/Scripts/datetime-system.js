
// This will help DataTables magic detect the "dd-MMM-yyyy" format; Unshift so that it's the first data type (so it takes priority over existing)
jQuery.fn.dataTableExt.aTypes.unshift(
    function (sData) {
        "use strict";
        //let's avoid tom-foolery in this function
        if (/^([0-2]?\d|3[0-1])-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-\d{4}/i.test(sData)) {
            return 'datetime-system';
        }
        return null;
    }
);

jQuery.fn.dataTableExt.oSort['datetime-system-asc'] = function (a, b) {
    "use strict"; //let's avoid tom-foolery in this function
     var temp_a = new Date(a),
       temp_b = new Date(b);
     var ordA = temp_a.getTime(),
        ordB = temp_b.getTime();

    return (ordA < ordB) ? -1 : ((ordA > ordB) ? 1 : 0);
};

jQuery.fn.dataTableExt.oSort['datetime-system-desc'] = function (a, b) {
    "use strict"; //let's avoid tom-foolery in this function
    var temp_a = new Date(a),
       temp_b = new Date(b);
    var ordA = temp_a.getTime(),
    ordB = temp_b.getTime();

  
    return (ordA < ordB) ? 1 : ((ordA > ordB) ? -1 : 0);
};