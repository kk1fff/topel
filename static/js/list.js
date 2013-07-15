!function($) {
  var LIST_IDEL = 0,
      LIST_REQUESTING = 1;
  var COLORS = [
    "#ff0000", "#ee1100", "#dd2200", "#cc3300", "#bb4400"
  ];


  function appendVoteResult(element, res) {
    var i, key, c = 0,
        s = $('<div><h4>' + res.title + '</h4></div>'),
        target = $('<div style="width:300px;height:300px"></div>'),
        data = [];

    for (i = 0; i < res.options.length; i++) {
      key = res.options[i];
      if (res.resultMap[key] !== undefined) {
        data.push({
          label: key,
          data: res.resultMap[key]// ,
        });
      }
    }

    s.append(target);
    element.append(s);

    var plot = $.plot(target, data, {
      series: {
        pie: {
          show: true,
          radius: 0.7
        }
      },
      grid: {
        autoHighlight: true,
        hoverable: true
      }
    });
  }

  function List(list) {
    this._list = list;
    this._status = LIST_IDEL;

    // Initial rendering.
    setTimeout(this.render.bind(this), 0);
  }

  List.prototype = {
    render: function() {
      if (this._status == LIST_IDEL) {
        this._internalRender();
      }
    },

    _requestList: function(doneCb) {
      $.get('/api/get-issue',
            this._handleRequestListDone.bind(this, doneCb),
            'json');
    },

    _handleRequestListDone: function(doneCb, data) {
      if (data.ok) {
        this._data = data.issueList;
      }
      doneCb();
    },

    _showInList: function() {
      var i, j, key,
          issue,
          issueString;
      for (i = 0; i < this._data.length; i++) {
        appendVoteResult(this._list, this._data[i]);
      }
      this._data = null; // free memory.
    },

    _internalRender: function() {
      switch (this._status) {
      case LIST_IDEL:
        this._requestList(this._internalRender.bind(this));
        this._status = LIST_REQUESTING;
        break;
      case LIST_REQUESTING:
        this._showInList();
        this._status = LIST_IDEL;
        break;
      }
    }
  };

  var list;
  $(document).on('ready', function() {
    list = new List($('#issue-list'));
  });
} (window.jQuery);
