app.models.Person = Backbone.Model.extend({
  url: function() {
    return Routes.person_path(this.get('guid'));
  },

  initialize: function() {
    if( this.get('profile') )
      this.profile = new app.models.Profile(this.get('profile'));
  },

  isSharing: function() {
    var rel = this.get('relationship');
    return (rel == 'mutual' || rel == 'sharing');
  },

  isReceiving: function() {
    var rel = this.get('relationship');
    return (rel == 'mutual' || rel == 'receiving');
  },

  isMutual: function() {
    return (this.get('relationship') == 'mutual');
  },

  isBlocked: function() {
    return (this.get('relationship') == 'blocked');
  },

  block: function() {
    var self = this;
    var block = new app.models.Block({block: {person_id: this.id}});

    // return the jqXHR with Promise interface
    return block.save()
      .done(function() { app.events.trigger('person:block:'+self.id); });
  },

  unblock: function() {
    var self = this;
    if( !this.get('block') ) {
      var def = $.Deferred();
      return def.reject();
    }

    var block = new app.models.Block({id: this.get('block').id});
    return block.destroy()
      .done(function() { app.events.trigger('person:unblock:'+self.id); });
  }
});
