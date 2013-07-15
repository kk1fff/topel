!function($) {

  // The "add an issue" dialog.
  var IssueDialog = function(modal) {
    this._modal = modal;

    this._doneBtn = modal.find('#btn_Done');
    this._optList = modal.find('#optionList');
    this._addOptBtn = modal.find('#addOption');
    this._issueName = modal.find('#issueName');

    this._optList.empty();
    this._issueName.val('');
    this._doneBtn.button('reset');

    this._modal.on('hidden', this.handleHidden.bind(this));
    this._addOptBtn.on('click', this.handleAddOpt.bind(this));
    this._doneBtn.on('click', this.handleDone.bind(this));
  };

  IssueDialog.prototype = {
    start: function() {
      this._modal.modal('show');
    },
    handleHidden: function() {
      if (this.onClose) {
        this.onClose();
      }
    },
    handleAddOpt: function() {
      this._optList.append('<tr><td><input type="text"></tr></td>');
    },
    handleDone: function() {
      var issueName,
          opts = [];

      issueName = $.trim(this._issueName.val());
      if (issueName == '') {
        alert("no issue name");
        return;
      }

      this._optList.find('input').each(function(i, ele) {
        ele = $(ele);
        if (ele.attr('type') != 'text') {
          return;
        }
        if ($.trim(ele.val()) == '') {
          return;
        }
        opts.push($.trim(ele.val()));
      });

      if (opts.length == 0) {
        alert("no option");
        return;
      }

      this._doneBtn.button('loading');
      $.post('/api/add-issue', {
        issueName: issueName,
        opts: JSON.stringify(opts)
      }, this.handleIssueSent.bind(this), 'json');
    },
    handleIssueSent: function(data) {
      if (data.ok) {
        this._modal.modal('hide');
      }
    }
  };

  // Handle the main template
  var MainHandler = function() {
    this._createIssue = $('#nav_createIssue');
    this._createIssue.on('click', this.handleCreateIssue.bind(this));
  };

  MainHandler.prototype = {
    handleCreateIssue: function(e) {
      var self = this;
      e.preventDefault();
      this._issueDialog = new IssueDialog($('#modal_createIssue'));
      this._issueDialog.onClose = function() {
        console.log('close dialog');
        self._issueDialog = null;
      };
      this._issueDialog.start();
    }
  };

  var mainHandler;
  $(document).on('ready', function() {
    mainHandler = new MainHandler();
  });
}(window.jQuery);
