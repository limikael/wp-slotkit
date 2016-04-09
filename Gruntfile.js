module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			slot: {
				options: {
					external: ["pixi.js"]
				},
				src: "src/app/SlotApp.js",
				dest: "bin/slot.js"
			}
		}
	});
}