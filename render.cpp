#include "render.h"
#include "utils.h"
#include "options.h"
#include <filesystem>
#include <iostream>
#include <windows.h>





sf::Image render::image=sf::Image{};

bool render::ready=false;
bool render::changed=false;



void render::renders(){
    sf::RectangleShape shape = sf::RectangleShape{ sf::Vector2f{ 800U, 800U  } };
    sf::RenderTexture renderTexture=sf::RenderTexture{};
    renderTexture.create(800U, 800U );

    sf::Shader shader = sf::Shader{};
    if (!shader.loadFromFile(utils::GetExeDirectory()+"/data/Shader.frag", sf::Shader::Fragment))
    {
        std::cerr << "Couldn't load fragment shader\n";
    }
    int t=0;
    while(true){
        t++;
        options::time=float(t)/10.0f;
        shader.setUniform("iResolution", sf::Glsl::Vec2{ renderTexture.getSize() });
        shader.setUniform("iTime", options::time);
        shader.setUniform("iVoxRes",options::voxRes);
        shader.setUniform("iPower",2.0f);
        shader.setUniform("iMaxTrace",options::maxTrace);

        shader.setUniform("isJulia",options::julia);
        shader.setUniform("isAnti",options::anti);
        shader.setUniform("iAlpha",options::alpha);
        renderTexture.clear(sf::Color::Black);
        renderTexture.draw(shape, &shader);
        renderTexture.display();

        image= renderTexture.getTexture().copyToImage();
        changed=true;


    }
}
