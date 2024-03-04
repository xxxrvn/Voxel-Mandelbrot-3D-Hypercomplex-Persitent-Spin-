#include <SFML/Graphics.hpp>
#include <filesystem>
#include <iostream>
#include <windows.h>




std::string GetExeDirectory()
{

    wchar_t szPath[MAX_PATH];
    GetModuleFileNameW( NULL, szPath, MAX_PATH );

    return (std::filesystem::path{ szPath }.parent_path() / "").generic_string();;
}


int main()
{
    int t=0;
    auto window = sf::RenderWindow{ { 800U, 800U }, "The Book of Shaders" };
    window.setFramerateLimit(144);

    auto shape = sf::RectangleShape{ sf::Vector2f{ window.getSize() } };
    sf::RenderTexture renderTexture;
     renderTexture.create(800U, 800U );

    auto shader = sf::Shader{};
    if (!shader.loadFromFile(GetExeDirectory()+"/data/Shader.frag", sf::Shader::Fragment))
    {
        std::cerr << "Couldn't load fragment shader\n";
        return -1;
    }

    auto mouse_position = sf::Vector2f{};

    while (window.isOpen())
    {
        for (auto event = sf::Event{}; window.pollEvent(event);)
        {
            if (event.type == sf::Event::Closed)
            {
                window.close();
            }
            else if (event.type == sf::Event::MouseMoved)
            {
                mouse_position = window.mapPixelToCoords({ event.mouseMove.x, event.mouseMove.y });
            }
        }

        shader.setUniform("iResolution", sf::Glsl::Vec2{ renderTexture.getSize() });
        shader.setUniform("iTime", float(t)/10);
        shader.setUniform("iVoxRes",2.0f);
        shader.setUniform("iPower",2.0f);
        shader.setUniform("iMaxTrace",1000);

        shader.setUniform("isJulia",false);
        shader.setUniform("isAnti",true);
        shader.setUniform("iAlpha",0.1f);


        t++;

        renderTexture.clear(sf::Color::Black);
        renderTexture.draw(shape, &shader);
        renderTexture.display();

        std::string xpath= GetExeDirectory()+"/data/test/xy0z_4_0/xy0z_4_0_"+std::string(4 - std::min(4, (int)(std::to_string(t)).length()), '0') + std::to_string(t)+".png";
        //renderTexture.getTexture().copyToImage().saveToFile(xpath);
       const sf::Texture& texture = renderTexture.getTexture();

        sf::Sprite sprite(texture);

        //renderTexture.resetGLStates();

        window.clear();
         window.draw(sprite);
        window.display();
       // if(t>=200)return(0);
    }}
