#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform float iPower;
uniform float iVoxRes;
uniform int iMaxTrace;

const float pi = 3.141592;
const float tau = 2.0*pi;



const float PI = 3.1415926535897932384626433832795;


vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec2 cx_log(vec2 a) {
    float ipart = atan(a.y,a.x);
    if (ipart > PI) ipart=ipart-(2.0*PI);
    return vec2(0.,ipart);
}

void cAdd(vec3 a,vec3 ad,vec3 b, vec3 bd,out vec3 c,out vec3 cd){
    c=vec3(a.x+b.x,a.y+b.y,a.z+b.z);

    vec3 nd;
    nd.x=(cx_log(vec2(cos(ad.x)/length(c.xy)*length(a.xy)+cos(bd.x)/length(c.xy)*length(b.xy),sin(ad.x)/length(c.xy)*length(a.xy)+sin(bd.x)/length(c.xy)*length(b.xy))).y);
    nd.y=(cx_log(vec2(cos(ad.y)/length(c.yz)*length(a.yz)+cos(bd.y)/length(c.yz)*length(b.yz),sin(ad.y)/length(c.yz)*length(a.yz)+sin(bd.y)/length(c.yz)*length(b.yz))).y);
    nd.z=(cx_log(vec2(cos(ad.z)/length(c.zx)*length(a.zx)+cos(bd.z)/length(c.zx)*length(b.zx),sin(ad.z)/length(c.zx)*length(a.zx)+sin(bd.z)/length(c.zx)*length(b.zx))).y);



    cd=nd;

    if(length(bd.x)+length(ad.x)==0.0){cd.x=0.;}
    if(length(bd.y)+length(ad.y)==0.0){cd.y=0.;}
    if(length(bd.z)+length(ad.z)==0.0){cd.z=0.;}

    if(length(a)==0.0){cd=bd;}
    if(length(b)==0.0){cd=ad;}


}


void cInit(float a, float b, float c,float q, out vec3 d, out vec3 dd){
    cAdd(vec3(a,0.0,0.0),vec3(((a<0.)?PI:0.),0.0,0.0),vec3(0.0,b,0.0),vec3(PI/2.+((b<0.)?PI:0.),0.0,0.0),d,dd);
    cAdd(d,dd,vec3(0.0,0.0,c),vec3(0.0,0.0,PI/2.+((c<0.)?PI:0.)),d,dd);
    cAdd(d,dd,vec3(0.0,0.0,q),vec3(0.0,PI/2.+((q<0.)?PI:0.),0.0),d,dd);
}
void cSqr(vec3 a,vec3 ad,out vec3 b,out vec3 bd){
    b=a;
    bd=ad;

    vec3 n=b;
    vec3 nd=bd;

    n=b;
    b.x=n.x*cos(nd.x)-n.y*sin(nd.x);
    b.y=n.x*sin(nd.x)+n.y*cos(nd.x);

    n=b;
    b.y=n.y*cos(nd.y)-n.z*sin(nd.y);
    b.z=n.y*sin(nd.y)+n.z*cos(nd.y);

    n=b;
    b.x=n.x*cos(nd.z)-n.z*sin(nd.z);
    b.z=n.x*sin(nd.z)+n.z*cos(nd.z);
    b*=length(b);
    bd=ad*2.;
}

void cPowi(vec3 a,vec3 ad,int npow,out vec3 b,out vec3 bd){
    b=a;
    bd=ad;

    vec3 n=b;
    vec3 nd=bd;
    for(int i=0;i<npow-1;i++){
    n=b;
    b.x=n.x*cos(nd.x)-n.y*sin(nd.x);
    b.y=n.x*sin(nd.x)+n.y*cos(nd.x);

    n=b;
    b.y=n.y*cos(nd.y)-n.z*sin(nd.y);
    b.z=n.y*sin(nd.y)+n.z*cos(nd.y);

    n=b;
    b.x=n.x*cos(nd.z)-n.z*sin(nd.z);
    b.z=n.x*sin(nd.z)+n.z*cos(nd.z);
    b*=length(b);
    }

    bd=ad*float(npow);
}


void cPowf(vec3 a,vec3 ad,float npow,out vec3 b,out vec3 bd){
    b=vec3(1,0,0);
    bd=ad;

    vec3 n=b;
    vec3 nd=bd;
    n=b;
    b.x=n.x*cos(nd.x*npow)-n.y*sin(nd.x*npow);
    b.y=n.x*sin(nd.x*npow)+n.y*cos(nd.x*npow);

    n=b;
    b.y=n.y*cos(nd.y*npow)-n.z*sin(nd.y*npow);
    b.z=n.y*sin(nd.y*npow)+n.z*cos(nd.y*npow);

    n=b;
    b.x=n.x*cos(nd.z*npow)-n.z*sin(nd.z*npow);
    b.z=n.x*sin(nd.z*npow)+n.z*cos(nd.z*npow);
    b*=pow(length(a),npow);

    bd=ad*npow;
}


float mandi(in vec3 p ) {

    vec3 z = vec3(0.,0.,0.);
    vec3 zd=vec3(0.,0.,0.);

    vec3 c;
    vec3 cd;
    vec3 q;
    vec3 qd;
    cInit(p.x,p.y,p.z,0.0,c,cd);

    bool inMandelbrotSet = true;

    for (int i=0; i<100; i++) {
        cPowf(z,zd,iPower,q,qd);
        //cSqr(z,zd,q,qd);

        cAdd(q,qd,c,cd,z,zd);

        if (length(z) > 2.) {
            inMandelbrotSet = false;
            break;
        }
    }
    if (inMandelbrotSet) {
        return(length(z));
    } else {
        return(0.);
    }
}


#define TIME iTime/2.0

const float sphereRadius = 15.0;
const float camRadius = 2.0*sphereRadius;

struct hit {
    bool didHit;
    vec3 col;
};

hit getVoxel(vec3 p) {
        float c=mandi(vec3(p)*.05/iVoxRes);
    if (c!=0.)
        return hit(true, (hsv2rgb(vec3(length(c),1.0,1))));
    else
        return hit(false, vec3(0,0,0));

}

vec3 lighting(vec3 norm, vec3 pos, vec3 rd, vec3 col) {
    vec3 lightDir = normalize(vec3(-1.0, 3.0, -1.0));
    float diffuseAttn = max(dot(norm, lightDir), 0.0);
    vec3 light = vec3(1.0,0.9,0.9);

    vec3 ambient = vec3(0.2, 0.2, 0.3);

    vec3 reflected = reflect(rd, norm);
    float specularAttn = max(dot(reflected, lightDir), 0.0);

    return col*(diffuseAttn*light*1.0 + specularAttn*light*0.6 + ambient);
}

// Voxel ray casting algorithm from "A Fast Voxel Traversal Algorithm for Ray Tracing"
// by John Amanatides and Andrew Woo
// http://www.cse.yorku.ca/~amana/research/grid.pdf
hit intersect(vec3 ro, vec3 rd) {
    //Todo: find out why this is so slow
    vec3 pos = (ro*iVoxRes);

    vec3 step = sign(rd);

    vec3 tDelta = step / rd;


    float tMaxX, tMaxY, tMaxZ;

    vec3 fr = fract(ro*iVoxRes);

    tMaxX = tDelta.x * ((rd.x>0.0) ? (1.0 - fr.x) : fr.x);
    tMaxY = tDelta.y * ((rd.y>0.0) ? (1.0 - fr.y) : fr.y);
    tMaxZ = tDelta.z * ((rd.z>0.0) ? (1.0 - fr.z) : fr.z);

    vec3 norm;
    int maxTrace = iMaxTrace;

    for (int i = 0; i < maxTrace; i++) {
        hit h = getVoxel(vec3(pos));
        if (h.didHit) {
            return hit(true, (lighting(norm, pos, rd, h.col)+h.col)/2.);
        }

        if (tMaxX < tMaxY) {
            if (tMaxZ < tMaxX) {
                tMaxZ += tDelta.z;
                pos.z += step.z;
                norm = vec3(0, 0,-step.z);
            } else {
                tMaxX += tDelta.x;
            	pos.x += step.x;
                norm = vec3(-step.x, 0, 0);
            }
        } else {
            if (tMaxZ < tMaxY) {
                tMaxZ += tDelta.z;
                pos.z += step.z;
                norm = vec3(0, 0, -step.z);
            } else {
            	tMaxY += tDelta.y;
            	pos.y += step.y;
                norm = vec3(0, -step.y, 0);
            }
        }
    }

 	return hit(false, vec3(0,0,0));
}

void main()
{

    vec2 uv = gl_FragCoord.xy / iResolution.xy - 0.5;
    vec3 worldUp = vec3(0,1,0);
    vec3 camPos = vec3(camRadius*sin(TIME), 10, 1.0*camRadius*cos(TIME));
    vec3 lookAt = vec3(0,0,0);
    vec3 camDir = normalize(lookAt - camPos);
    vec3 camRight = normalize(cross(camDir, worldUp));
    vec3 camUp = cross(camRight, camDir);

    vec3 filmCentre = camPos + camDir*0.3;
    vec2 filmSize = vec2(1,iResolution.y / iResolution.x);

    vec3 filmPos = filmCentre + uv.x*filmSize.x*camRight + uv.y*filmSize.y*camUp;
    vec3 ro = camPos;
    vec3 rd = normalize(filmPos - camPos);

    hit h = intersect(ro, rd);
    if(h.didHit) {
        gl_FragColor = vec4(h.col,1);
    } else{
        gl_FragColor = vec4(0,0,0,0);
    }
}
