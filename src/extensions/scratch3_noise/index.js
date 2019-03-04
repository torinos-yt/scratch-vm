const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const noise = require("./perlin");

const Noise = new noise();

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i44Os44Kk44Ok44O8XzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTt9DQo8L3N0eWxlPg0KPGc+DQoJPHJlY3QgeD0iNC42IiB5PSIxNS44NCIgY2xhc3M9InN0MCIgd2lkdGg9IjcuODUiIGhlaWdodD0iNS41OSIvPg0KCTxyZWN0IHg9IjE5LjMxIiB5PSI4LjIyIiBjbGFzcz0ic3QwIiB3aWR0aD0iMTMuOTIiIGhlaWdodD0iMTIuMTkiLz4NCgk8cmVjdCBjbGFzcz0ic3QxIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz4NCjwvZz4NCjwvc3ZnPg0K';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i44Os44Kk44Ok44O8XzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTt9DQo8L3N0eWxlPg0KPGc+DQoJPHJlY3QgeD0iNC42IiB5PSIxNS44NCIgY2xhc3M9InN0MCIgd2lkdGg9IjcuODUiIGhlaWdodD0iNS41OSIvPg0KCTxyZWN0IHg9IjE5LjMxIiB5PSI4LjIyIiBjbGFzcz0ic3QwIiB3aWR0aD0iMTMuOTIiIGhlaWdodD0iMTIuMTkiLz4NCgk8cmVjdCBjbGFzcz0ic3QxIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz4NCjwvZz4NCjwvc3ZnPg0K';

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

function curl2(v1, v2){
	const ep = 0.0001;

	const dpdx0 = Noise.simplex2(v1 - ep, v2);
	const dpdx1 = Noise.simplex2(v1 + ep, v2);
	const dpdy0 = Noise.simplex2(v1, v2 - ep);
	const dpdy1 = Noise.simplex2(v1, v2 + ep);

	const x = dpdy1 - dpdy0;
	const y = dpdx1 - dpdx0;

	return [x / (ep * 2), y / (ep * 2) * -1];
}

const DementionAttribute = {
	X : 'x',
	Y : 'y'
};

class Scratch3Noise {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
	}

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'noise',
            name: 'Noise',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
				{
                    opcode: 'perlinNoise',
                    blockType: BlockType.REPORTER,
                    text: 'PerlinNoise x[X] y[Y] Seed[SEED]',
                    arguments: {
						X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
						},
						Y: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						},
						SEED: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						}
                    }
				},
				{
                    opcode: 'simplexNoise',
                    blockType: BlockType.REPORTER,
                    text: 'SimplexNoise x[X] y[Y] Seed[SEED]',
                    arguments: {
						X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
						},
						Y: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						},
						SEED: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						}
                    }
				},
				{
                    opcode: 'curlNoise',
                    blockType: BlockType.REPORTER,
                    text: 'CurlNoise x[X] y[Y] Seed[SEED]: [DEMENTION]',
                    arguments: {
						X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
						},
						Y: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						},
						SEED: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						},
						DEMENTION: {
							type: ArgumentType.NUMBER,
							menu: 'Demention',
							defaultValue: DementionAttribute.X
						}
                    }
                }
            ],
            menus: {
				Demention : [
					{
						value: DementionAttribute.X,
						text: 'x'
					},
					{
						value: DementionAttribute.Y,
						text: 'y'
					}
				]
            }
        };
    }

	perlinNoise(args){
		const v = [Cast.toNumber(args.X), Cast.toNumber(args.Y)];
		const seed = Cast.toNumber(args.SEED);
		Noise.seed(seed);
		return Noise.perlin2(v[0], v[1]);
	}

	simplexNoise(args){
		const v = [Cast.toNumber(args.X), Cast.toNumber(args.Y)];
		const seed = Cast.toNumber(args.SEED);
		Noise.seed(seed);
		return Noise.simplex2(v[0], v[1]);
	}

	curlNoise(args){
		const v = [Cast.toNumber(args.X), Cast.toNumber(args.Y)];
		const seed = Cast.toNumber(args.SEED);
		Noise.seed(seed);
		const c = curl2(v[0], v[1]);
		if(args.DEMENTION === DementionAttribute.X) return c[0];
		return c[1];
	}
}

module.exports = Scratch3Noise;