var smileTableValues        = [];
var smileTableColumns       = [];
var smileTableAdditional    = null;
var smileTableContainer     = null;
var smileTableCurrentColumn = null;
var smileTableCurrentOrder  = null;

/**
 * Open a table
 *
 * @param title
 * @param values
 * @param columns
 * @param additional
 * @param titleId
 * @param containerId
 */
function smileTableOpen(title, values, columns, additional, titleId, containerId)
{
    smileTableValues     = values;
    smileTableColumns    = columns;
    smileTableAdditional = additional;
    smileTableContainer  = document.getElementById(containerId);

    document.getElementById(titleId).innerHTML = smileTableProtectValue(title);

    smileTableSort(Object.keys(smileTableColumns)[0], 'asc');
}

/**
 * Close a table
 */
function smileTableClose()
{
    smileTableContainer.innerHTML = '';

    smileTableValues        = [];
    smileTableColumns       = [];
    smileTableAdditional    = null;
    smileTableContainer     = null;
    smileTableCurrentColumn = null;
    smileTableCurrentOrder  = null;
}

/**
 * Sort a table
 *
 * @param column
 * @param order
 */
function smileTableSort(column, order)
{
   smileTableCurrentColumn = column;
   smileTableCurrentOrder = order;

   var isDecimal = false;

   if (smileTableColumns[column]['class'].substring(0, 13) === 'st-value-unit') {
       isDecimal = true;
   }
   if (smileTableColumns[column]['class'] === 'st-value-number') {
       isDecimal = true;
   }

   smileTableValues.sort(
       function(rowA, rowB)
       {
           var a = rowA[smileTableCurrentColumn];
           var b = rowB[smileTableCurrentColumn];

           if (isDecimal) {
                a = parseFloat(a);
                b = parseFloat(b);
           }

           if (a<b) {
               return ((smileTableCurrentOrder==='asc') ? -1 : 1);
           }

           if (a>b) {
               return ((smileTableCurrentOrder==='asc') ? 1 : -1);
           }

           return 0
       }
   );

   smileTableDisplay();
}

/**
 * Display a table
 */
function smileTableDisplay()
{
    var html = '';
    var columnKey;
    var column;
    var valuesKey;
    var values;
    var nbColumns = 0;
    var needHjs = false;

    html+= '<table class="smile-table">';

    html+= '<thead>';
    html+= '<tr>';
    for (columnKey in smileTableColumns) {
        nbColumns++;
        column = smileTableColumns[columnKey];
        html+= '<th class="'+column['class']+'">';
        if (smileTableCurrentColumn === columnKey && smileTableCurrentOrder === 'asc') {
            html+= '<span class="selected">&#x25B2;</span>';
        } else {
            html+= '<span onclick="smileTableSort(\''+columnKey+'\', \'asc\');">&#x25B2;</span>';
        }
        if (smileTableCurrentColumn === columnKey && smileTableCurrentOrder === 'desc') {
            html += '<span class="selected">&#x25BC;</span>'
        } else {
            html += '<span onclick="smileTableSort(\'' + columnKey + '\', \'desc\');">&#x25BC;</span>';
        }
        html+= column['title'];
        html+= '</th>';
    }
    html+= '</tr>';
    html+= '</thead>';

    html+= '<tbody>';
    for (valuesKey = 0; valuesKey < smileTableValues.length; valuesKey++) {
        html+= '<tr';
        if (smileTableAdditional) {
            html+= ' onclick="smileTableToggleRow(\'smile-table-row-'+valuesKey+'\');" class="smile-has-sub-table"'
        }
        html+= '>';
        values = smileTableValues[valuesKey];
        for (columnKey in smileTableColumns) {
            column = smileTableColumns[columnKey];

            var hjsType = null;
            var cssClass = column['class'];
            if (cssClass.substring(0, 9) === 'hjs-code-') {
                hjsType = column['class'].substring(9);
                cssClass = 'hjs-code';
                needHjs = true;
            }

            html+= '<td class="'+cssClass+'"';
            html+= '>';
            if (hjsType) {
                html+= '<pre><code class="'+hjsType+'">';
            }
            html+= smileTableProtectValue(values[columnKey]);
            if (hjsType) {
                html+= '</code></pre>';
            }
            html+= '</td>';
        }
        html+= '</tr>';

        if (smileTableAdditional) {
            html+= '<tr class="smile-sub-table" id="smile-table-row-'+valuesKey+'">';
            html+= '<td colspan="'+nbColumns+'" >'+values[smileTableAdditional]+'</td>';
            html+= '</tr>';
        }
    }
    html+= '</tbody>';

    html+= '</table>';

    smileTableContainer.innerHTML = html;

    if (needHjs) {
        setTimeout('smileTableHighlight();', 100);
    }
}

/**
 * HighLight the codes
 */
function smileTableHighlight()
{
    var blocks = document.querySelectorAll('pre code');
    [].forEach.call(blocks, hljs.highlightBlock);
}

/**
 * toogle a table row
 *
 * @param rowKey
 */
function smileTableToggleRow(rowKey)
{
    var obj = document.getElementById(rowKey);

    obj.style.display = ((obj.style.display === 'table-row') ? 'none' : 'table-row');
}

/**
 * Protect a value
 *
 * @param value
 *
 * @returns string
 */
function smileTableProtectValue(value)
{
    value = ''+value;
    return value.replace('<', '&lt;');
}
