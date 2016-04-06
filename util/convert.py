import glob
from PIL import Image

mapList = glob.glob('../public/data_old/*_map.png')

width = 240
height = 160

for mapPath in mapList:

	print mapPath

	try:
		img = Image.open(mapPath)
	except Exception, e:
		img = Image.new("RGB", (width, height))
		print "CREATED"
	



	thumb = Image.new("RGB", (width, height))

	r1, g1, b1 = (245, 38, 97)  # aka
	r2, g2, b2 = (238, 145, 33) # orange

	rd, gd, bd = (r2-r1, g2-g1, b2-b1)



	for y in xrange(height):
		for x in xrange(width):
			r, g, b = img.getpixel((x, y))

			r *= 32

			tr, tg, tb = (0, 0, 0)

			if (r == 0): # BLNK
				tr, tg, tb = (71, 77, 82)


			elif (r == 32): # WALL
				
				if ((x+y) % 3.0 >= 1):
					tr, tg, tb = (39, 46, 56)
				else:
					tr, tg, tb = (50, 57, 66)

			elif (r == 64): # FUSE
				tr, tg, tb = (213, 215, 191)

			elif (r == 96): # BOMB
				tr, tg, tb = (218, 217, 92)

			else :# FIRE or EXPLD

				life = b / 255.0

				tr, tg, gb = (int(r1 + rd*life), int(g1 + gd*life), int(b1 + bd*life))





			img.putpixel((x, y), (r, g, b))
			thumb.putpixel((x, y), (tr, tg, tb))

	img.save(mapPath.replace('data_old', 'data'))

	thumb = thumb.transpose(Image.FLIP_TOP_BOTTOM)
	thumb = thumb.resize((width * 4, height * 4), Image.NEAREST)
	thumb.save(mapPath.replace('data_old', 'data').replace('map', 'thumb'))