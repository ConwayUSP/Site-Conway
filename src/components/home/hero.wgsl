fn niam(time: f32, uv: vec2<f32>, mouse_pos: vec2<f32>) -> vec4<f32> {
    // ray origin e target
    var ro = vec3<f32>(7.0 * sin(mouse_pos.x * 2 * PI), (-mouse_pos.y) * 10 + 7 , 7.0 * cos(mouse_pos.x * 2 * PI));
    // deixando a câmera parada para debug
    // ro = vec3<f32>(9.0, 2.0, 2.6);
    let ta = vec3<f32>(0.0, 0.0, 0.0);

    // lookat
    let ww = normalize(ta - ro);
    let uu = normalize(cross(ww, vec3<f32>(0.0, 1.0, 0.0)));
    let vv = normalize(cross(uu, ww));

    // direção do raio
    let nuv = uv * 2.0 - 1.0;
    let rd = normalize(nuv.x * uu + nuv.y * vv + 1.5 * ww);

    var finalColor = vec3<f32>(0.0);

    let res = raycast(ro, rd, time);
    let t = res;
    // Sem geometria, deixe aparecer o fundo da home.
    if (t <= 0.0) {
        return vec4<f32>(0.0);
    }
    // bateu em algo
    if(t > 0.0) {
        let p = ro + rd * t;   // ponto onde colidiu
        let n = calcNormal(p, time); // normal
        let ao = calcAO(p, n, time); // oclusão ambiente

        // direção da luz
        let ld = normalize(vec3<f32>(0.8, 0.5, -0.8));
        let ld2 = vec3<f32>(0.0, -1.0, 0.0); // iluminação secundária vindo de baixo
        // componente difuso
        let dif = max(dot(n, ld), 0.0);
        let dif2 = 0.5 * max(dot(n, ld2), 0.0);
        // componente ambiente
        let amb = 0.2 + 0.8 * clamp(0.5 + 0.5 * n.y, 0.0, 1.0);

        // definindo a cor do fragmento
        let hit_surface = map(p, time);
        let color = hit_surface.color; 
        finalColor = color * (dif + amb) * ao + dif2 * vec3<f32>(0.27, 0.035, 0.11);
    }

    return vec4<f32>(finalColor, 1.0);
}

const PI: f32 = 3.14159265359;
const CONWAY_ID: f32 = 1.0;
const GG_ID: f32 = 2.0;
const OP_ID: f32 = 3.0;
const DLC_ID: f32 = 4.0;

struct Surface {
    dist: f32,
    color: vec3<f32>,
}

// função de distância com sinal de um cubo
fn sdBox(p: vec3<f32>, b: vec3<f32>) -> f32 {
    let d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, vec3<f32>(0.0)));
}

// O novo smin que funde geometria e cor
fn sminSurface(a: Surface, b: Surface, k: f32) -> Surface {
    let h = clamp(0.5 + 0.5 * (b.dist - a.dist) / k, 0.0, 1.0);
    // interpola a distância
    let d = mix(b.dist, a.dist, h) - k * h * (1.0 - h);
    // interpola a cor linearmente
    let c = mix(b.color, a.color, h);
    
    return Surface(d, c);
}

fn smin(a: f32, b: f32, k: f32) -> f32 {
    let h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
}

// montando a cena
fn map(p: vec3<f32>, time: f32) -> Surface {
    // modelagem da logo da conway
    let conway1 = sdBox(p, vec3<f32>(0.3, 0.3, 0.9));
    let conway2 = sdBox(p + vec3<f32>(0.0, -0.6, 0.6), vec3<f32>(0.3));
    let conway3 = sdBox(p + vec3<f32>(0.0, -1.2, 0.0), vec3<f32>(0.3));
    let cut1 = min(sdBox(p + vec3<f32>(0.6, -0.6, 0.0), vec3<f32>(0.3, 0.9, 1.2)), 1.0);
    let cut2 = min(sdBox(p + vec3<f32>(-0.6, -0.6, 0.0), vec3<f32>(0.3, 1.2, 1.2)), 1.0);
    let cut3 = min(sdBox(p + vec3<f32>(0.0, -0.6, 1.2), vec3<f32>(0.9, 0.9, 0.3)), 1.0);
    var dist_conway = min(smin(conway1, conway2, 0.2), conway3);
    dist_conway = max(max(max(dist_conway, -cut1), -cut2), -cut3);
    let sur_conway = Surface(dist_conway, vec3<f32>(1.0, 0.7, 1.0));

    // modelagem da logo de GG
    let GG_p = 2.8 * (cos(time * 0.5) * normalize(vec3<f32>(6.2, 0.0, 2.2)) + sin(time * 0.5) * normalize(vec3<f32>(0.2, -5.0, -4.0)));
    let GG1 = sdBox(p + GG_p + vec3<f32>(0.0, -0.4, -0.3), vec3<f32>(0.2));
    let GG2 = sdBox(p + GG_p + vec3<f32>(0.0, 0.0, 0.1), vec3<f32>(0.2));
    let GG3 = sdBox(p + GG_p + vec3<f32>(0.0, -0.4, 0.5), vec3<f32>(0.2));
    let GG4 = sdBox(p + GG_p + vec3<f32>(0.0, -0.8, 0.1), vec3<f32>(0.2));
    var dist_GG = min(min(min(GG1, GG2), GG3), GG4);
    let sur_GG = Surface(dist_GG, vec3<f32>(2.9, 0.9, 0.15));

    // modelagem da logo de OP
    let OP_p = 2.3 * (cos(time * 0.75) * normalize(vec3<f32>(-4.5, -1.0, 0.1)) + sin(time * 0.75) * normalize(vec3<f32>(2.5, -3.0, 4.0)));
    let OP1 = sdBox(p + OP_p + vec3<f32>(0.0, -0.6, -0.3), vec3<f32>(0.2));
    let OP2 = sdBox(p + OP_p + vec3<f32>(0.0, -0.2, 0.1), vec3<f32>(0.2));
    let OP3 = sdBox(p + OP_p + vec3<f32>(0.0, -0.6, 0.5), vec3<f32>(0.2));
    let OP4 = sdBox(p + OP_p + vec3<f32>(0.0, -1.0, 0.1), vec3<f32>(0.2));
    let OP5 = sdBox(p + OP_p + vec3<f32>(0.0, -1.0, 0.5), vec3<f32>(0.2));
    let OP6 = sdBox(p + OP_p + vec3<f32>(0.0, -0.2, -0.3), vec3<f32>(0.2));
    var dist_OP = min(min(min(min(min(OP1, OP2), OP3), OP4), OP5), OP6);
    let sur_OP = Surface(dist_OP, vec3<f32>(0.1, 0.9, 0.8));
  
    // modelagem da logo de DLC
    let DLC_p = 3.5 * (cos(time * 0.4) * normalize(vec3<f32>(-2.5, 1.0, 2.0)) + sin(time * 0.4) * normalize(vec3<f32>(-0.5, 4.0, 3.0)));
    let DLC1 = sdBox(p + DLC_p + vec3<f32>(0.0, -0.4, -0.3), vec3<f32>(0.2));
    let DLC2 = sdBox(p + DLC_p + vec3<f32>(0.0, 0.0, 0.1), vec3<f32>(0.2));
    let DLC3 = sdBox(p + DLC_p + vec3<f32>(0.0, -0.4, 0.9), vec3<f32>(0.2));
    let DLC4 = sdBox(p + DLC_p + vec3<f32>(0.0, -0.8, 0.1), vec3<f32>(0.2));
    let DLC5 = sdBox(p + DLC_p + vec3<f32>(0.0, -0.8, 0.5), vec3<f32>(0.2));
    let DLC6 = sdBox(p + DLC_p + vec3<f32>(0.0, 0.0, 0.5), vec3<f32>(0.2));
    var dist_DLC = min(min(min(min(min(DLC1, DLC2), DLC3), DLC4), DLC5), DLC6);
    let sur_DLC = Surface(dist_DLC, vec3<f32>(1.1, 0.05, 0.2));
    
    // misturando as formas e cores na colisão
    let mix_f = 0.4;
    var final_surface = sminSurface(sur_conway, sur_GG, mix_f);
    final_surface = sminSurface(final_surface, sur_OP, mix_f);
    final_surface = sminSurface(final_surface, sur_DLC, mix_f);
    // retornando a distância e um índice de material
    return final_surface;
}

fn raycast(ro: vec3<f32>, rd: vec3<f32>, time: f32) -> f32 {
    var t: f32 = 0.0;
    let tmax: f32 = 20.0;

    for(var i: i32 = 0; i < 80; i++) {
        // descobrindo a distância para os objetos
        let h = map(ro + rd * t, time).dist; 
        // colisão
        if (abs(h) < (0.0003 * t)) {
            return t;
        }
        // andando o raio
        t += h;
        if(t > tmax) { break; }
    }
    return -1.0;
}

// cálculo do vetor normal
fn calcNormal(p: vec3<f32>, time: f32) -> vec3<f32> {
    let e = vec2<f32>(1.0, -1.0) * 0.5773 * 0.0005;
    return normalize(
        e.xyy * map(p + e.xyy, time).dist +
        e.yyx * map(p + e.yyx, time).dist +
        e.yxy * map(p + e.yxy, time).dist +
        e.xxx * map(p + e.xxx, time).dist
    );
}

// cálculo de oclusão de ambiente
fn calcAO(pos: vec3<f32>, nor: vec3<f32>, time: f32) -> f32 {
    var occ: f32 = 0.0;
    var sca: f32 = 1.0;
    for(var i: i32 = 0; i < 5; i++ ) {
        let h = 0.01 + 0.12 * f32(i) / 4.0;
        let d = map(pos + h * nor, time).dist;
        occ += (h - d) * sca;
        sca *= 0.75;
        if(occ > 0.45) { break; }
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0) * (0.5 + 0.5 * nor.y);
}
