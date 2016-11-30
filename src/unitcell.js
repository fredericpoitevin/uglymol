
// eslint-disable-next-line max-params
export function UnitCell(a /*:number*/, b /*:number*/, c /*:number*/,
                  alpha /*:number*/, beta /*:number*/, gamma /*:number*/) {
  if (a <= 0 || b <= 0 || c <= 0 || alpha <= 0 || beta <= 0 || gamma <= 0) {
    throw Error('Zero or negative unit cell parameter(s).');
  }
  this.parameters = [a, b, c, alpha, beta, gamma];
  const deg2rad = Math.PI / 180.0;
  const cos_alpha = Math.cos(deg2rad * alpha);
  const cos_beta = Math.cos(deg2rad * beta);
  const cos_gamma = Math.cos(deg2rad * gamma);
  const sin_alpha = Math.sin(deg2rad * alpha);
  const sin_beta = Math.sin(deg2rad * beta);
  const sin_gamma = Math.sin(deg2rad * gamma);
  if (sin_alpha === 0 || sin_beta === 0 || sin_gamma === 0) {
    throw Error('Impossible angle - N*180deg.');
  }
  const cos_alpha_star_sin_beta = (cos_beta*cos_gamma - cos_alpha) / sin_gamma;
  const cos_alpha_star = cos_alpha_star_sin_beta / sin_beta;
  const s1rca2 = Math.sqrt(1.0 - cos_alpha_star * cos_alpha_star);
  // The orthogonalization matrix we use is described in ITfC B p.262:
  // "An alternative mode of orthogonalization, used by the Protein
  // Data Bank and most programs, is to align the a1 axis of the unit
  // cell with the Cartesian X_1 axis, and to align the a*_3 axis with the
  // Cartesian X_3 axis."
  /* eslint-disable no-multi-spaces, comma-spacing */
  const orth = [a,   b * cos_gamma,  c * cos_beta,
                0.0, b * sin_gamma, -c * cos_alpha_star_sin_beta,
                0.0, 0.0          ,  c * sin_beta * s1rca2];
  // based on xtal.js which is based on cctbx.uctbx
  const frac = [
    1.0 / a,
    -cos_gamma / (sin_gamma * a),
    -(cos_gamma * cos_alpha_star_sin_beta + cos_beta * sin_gamma) /
        (sin_beta * s1rca2 * sin_gamma * a),
    0.0,
    1.0 / (sin_gamma * b),
    cos_alpha_star / (s1rca2 * sin_gamma * b),
    0.0,
    0.0,
    1.0 / (sin_beta * s1rca2 * c),
  ];

  function multiply(xyz, mat) {
    return [mat[0] * xyz[0] + mat[1] * xyz[1] + mat[2] * xyz[2],
                              mat[4] * xyz[1] + mat[5] * xyz[2],
                                                mat[8] * xyz[2]];
  }

  this.fractionalize = function (xyz) { return multiply(xyz, frac); };
  this.orthogonalize = function (xyz) { return multiply(xyz, orth); };
}

