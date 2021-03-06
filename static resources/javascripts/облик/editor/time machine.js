/*
 * Time machine
 */
Editor.Time_machine = new Class
({
	Binds: ['snapshot', 'typing_snapshot'],

	snapshots: [],
	redo_snapshots: [],

	max_snapshots: 100,	
	typing_snapshot_delay: 1000,

	initialize: function(editor)
	{
		this.editor = editor
		
		//this.snapshot()
		
		this.editor.content.on('content_changed.editor', (function(event, options)
		{
			if (options.undo || options.redo)
				return
			
			this.redo_snapshots.empty()
		})
		.bind(this))
	},

	undo: function()
	{
		if (!this.can_undo())
			return false

		var snapshot = this.snapshots.shift()
		this.redo_snapshot()
		this.editor.load_content(snapshot.content)
		this.editor.content_changed({ undo: true })
		
		if (snapshot.caret)
			this.editor.caret.position(snapshot.caret.get_container(), snapshot.caret.offset)
	
		return true
	},
	
	redo: function()
	{
		if (!this.can_redo())
			return false
			
		var snapshot = this.redo_snapshots.shift()
		this.snapshot()
		
		this.editor.load_content(snapshot.content)
		this.editor.content_changed({ redo: true })
		
		if (snapshot.caret)
			this.editor.caret.position(snapshot.caret.get_container(), snapshot.caret.offset)
			
		return true
	},
	
	can_undo: function()
	{
		return !this.snapshots.is_empty()
	},
	
	can_redo: function()
	{
		return !this.redo_snapshots.is_empty()
	},
	
	get_most_recent_snapshot_time: function()
	{
		if (this.snapshots.is_empty())
			return 0
			
		return this.snapshots[0].time
	},

	snapshot: function()
	{
		if (this.get_most_recent_snapshot_time() >= this.editor.content_changed_on)
			return
		
		this.snapshots.unshift(this.create_snapshot())
	},

	redo_snapshot: function()
	{
		this.redo_snapshots.unshift(this.create_snapshot())
	},

	create_snapshot: function()
	{
		if (this.snapshots.length === this.max_snapshots)
			this.snapshots.pop()
		
		var editor = this.editor
		
		var snapshot = 
		{
			time: now().getTime(),
			content: editor.content.html()
//			content: editor.content.outer_html()
		}
		
		var caret = editor.caret.get()
		if (caret)
		{
			var caret_position = editor.caret.caret_position()
			
			snapshot.caret =
			{
				offset: caret_position.offset,
				node_backtrack: Dom.get_node_backtrack(caret_position.node, editor.content[0]),
				get_container: function() { return Dom.get_node_by_backtrack(this.node_backtrack.clone(), editor.content[0]) }
			}
		}
		
		return snapshot
	},
	
	can_snapshot_typing: function()
	{
		if (!this.editor.continuous_typing)
			return true
	
		if (now().getTime() - this.editor.content_changed_on < this.typing_snapshot_delay)
			return false
			
		return true
	}
})