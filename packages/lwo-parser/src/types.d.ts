/**
 * VEC12 ::= X[F4], Y[F4], Z[F4]
 * 3D coordinates are written as an XYZ vector in floating point format. The values are distances along the X, Y, and Z axes.
 */

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export interface Color {
  red: number;
  green: number;
  blue: number;
  pad: number;
}

export interface SequenceOptions {
  offset: number;
  flags: Flags;
  loopLength: number;
}

export interface Wrap {
  widthWrap: number;
  heightWrap: number;
}

export type Flags = {
  [name: string]: number;
}

export interface Polygon {
  /**
   * **numvert[U2]** \
   * a short integer specifying the number of vertices in the polygon
   */
  numvert: number;
  /**
   * **vert[U2] # numvert** \
   * [numvert] many short integers specifying the vertices themselves (as indices into the points list)
   */
  vert: number[];
  /**
   * **surf[I2]** \
   * a short integer specifying which surface is used by the polygon (as an index into the surfaces list)
   */
  surf: number;
}

export interface Surface {

}

export interface LightwaveObject {
  /**
   * **Point List** \
   * _PNTS { point-location[VEC12] * }_ \
   * This chunk contains a list of the X, Y, and Z coordinates of all the points in an object. Since each coordinate has three components, and each component is stored as a four byte floating point number, the number of points in an object can be determined by dividing the size in bytes of the PNTS chunk by 12.
   *
   * By convention, the +X direction is to the right or east, the +Y direction is upward, and the +Z direction is forward or north. For models of real-world objects, the unit size is usually considered to be one meter. The coordinates are specified relative to an object's pivot point. See the LightWave Modeler manual for more information about LightWave 3D's geometric conventions.
   *
   * Points in the PNTS chunk are numbered in the order they occur, starting with zero. This index is then used by polygons to define their vertices. The PNTS chunk must be before the POLS, CRVS, and PCHS chunks in the file.
   */
  PNTS: Vector[] | Buffer;
  /**
   * **Surface List** \
   * _SRFS { surf-name[S0] * }_ \
   * This chunk contains a list of the names of all the surfaces in an object. Each surface name appears as a null-terminated character string. If the length of the string (including the null) is odd, an extra null byte is added. Surface names should be read from the file until as many bytes as the chunk size specifies have been read.
   *
   * In LightWave 3D terminology, a "surface" is defined as a named set of shading attributes. Each polygon contains a reference to the surface used to color the polygon. The names as listed in the SRFS chunk are numbered in the order they occur, starting from 1, and this index is used by polygons to define their surface. The SRFS chunk must be before the POLS, CRVS, and PCHS chunks in the file.
   */
  SRFS: string[];
  /**
   * **Face List** \
   * _POLS { ( numvert[U2], vert[U2] # numvert, surf[I2] ) * }_ \
   * This chunk contains a list of all the polygons in an object. The number of vertices in a polygon may vary from one to 200. The vertex list for each polygon should begin at a convex vertex and proceed clockwise as seen from the visible side of the polygon (LightWave 3D polygons are single-sided, except for those whose surfaces have the double- sided flag set). Polygons should be read from the file until as many bytes as the chunk size specifies have been read.
   *
   * _Since the points in the PNTS chunk are referenced using two-byte integers, the effective maximum number of points in a LightWave object file is 65,536. This is an inherient limitation of this current format._
   *
   * A negative surface number for a polygon indicates that the polygon has detail polygons (which are drawn on top of the main polygon and may be coplanar with it). In this case, the next number in the file is a short integer specifying how many detail polygons belong to the current polygon. This is followed by a list of those detail polygons, where each entry is of the same format as described above for regular polygons (except that the detail polygons cannot have details of their own). The list of regular polygons then resumes. To determine which surface is used by a polygon with a negative surface number, the absolute value of that number should be used. Note, however, that detail polygons are mostly obsolete so even though they may be recognized by LightWave and old files contain them, they should be ignored.
   */
  POLS: Polygon[];
  /**
   * **Surface Definition** \
   * _SURF { name[S0], attributes[SUB-CHUNK] * }_ \
   * Each SURF chunk describes the surface attributes of a particular surface. These chunks begin with the name of the surface being described. Following the name is a series of sub-chunks, which are like normal IFF chunks except that their sizes are specified by short integers instead of longs. It is likely that the variety of sub-chunks will grow as new surface attributes are added to the program, but any unknown sub-chunks may be skipped over by using the size. Sub-chunks should be read from the file until as many bytes as the chunk size specifies have been read.
   */
  SURF: Surface[];
}

export type SurfaceAttributes = Partial<{
  COLR: Color;
  FLAG: Flags;

  LUMI: number;
  DIFF: number;
  SPEC: number;
  REFL: number;
  TRAN: number;

  VLUM: number;
  VDIF: number;
  VSPC: number;
  VRFL: number;
  VTRN: number;

  GLOS: number;

  RIMG: string;
  RFLT: number;
  RSAN: number;
  RIND: number;

  EDGE: number;
  SMAN: number;

  CTEX: string;
  DTEX: string;
  STEX: string;
  RTEX: string;
  TTEX: string;
  LTEX: string;
  BTEX: string;

  TFLG: Flags;

  TSIZ: Vector;
  TCTR: Vector;
  TFAL: Vector;
  TVEL: Vector;

  TCLR: Color;

  TVAL: number;

  TAMP: number;

  TIMG: string;
  TALP: string;

  TWRP: Wrap;

  TAAS: number;
  TOPC: number;

  IMSQ: SequenceOptions;
}>

export interface Surface {
  name: string;
  attributes: SurfaceAttributes;
}
