app.views.Bookmarklet = Backbone.View.extend({
  separator: ' - ',

  initialize: function(opts) {
    // init a standalone publisher
    app.publisher = new app.views.Publisher({standalone: true});

    app.publisher.on('publisher:add', this._postSubmit, this);
    app.publisher.on('publisher:sync', this._postSuccess, this);
    app.publisher.on('publisher:error', this._postError, this);

    this.param_contents = opts;
  },

  render: function() {
    app.publisher.open();
    app.publisher.setText(this._publisherContent());

    return this;
  },

  _publisherContent: function() {
    var p = this.param_contents;
    if( p.content ) return p.content;

    var contents = p.title + this.separator + p.url;
    if( p.notes ) contents += this.separator + p.notes;
    return contents;
  },

  _postSubmit: function(evt) {
    this.$('h4').text(Diaspora.I18n.t('bookmarklet.post_submit'));
  },

  _postSuccess: function(evt) {
    this.$('h4').text(Diaspora.I18n.t('bookmarklet.post_success'));
    app.publisher.close();
    this.$("#publisher").addClass("hidden");
    _.delay(window.close, 2000);
  },

  _postError: function(evt) {
    this.$('h4').text(Diaspora.I18n.t('bookmarklet.post_something'));
  }
});
