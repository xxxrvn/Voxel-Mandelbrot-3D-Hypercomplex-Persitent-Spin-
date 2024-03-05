#include <SFML/Graphics.hpp>
#include <filesystem>
#include <iostream>
#include <windows.h>
#include "render.h"
#include "options.h"
#include "utils.h"
#include <thread>
#include <TGUI/TGUI.hpp>
#include <TGUI/Backend/SFML-Graphics.hpp>





int main()
{
    int t=0;
    auto window = sf::RenderWindow{ { 1000U, 800U }, "VoxelToast" };
    //window.setFramerateLimit(144);
    tgui::Gui gui{window};
    sf::Texture texture;

    sf::RectangleShape opt_back;
    opt_back.setSize(sf::Vector2f(200U, 800U));
    opt_back.setFillColor(sf::Color::Magenta);
    opt_back.setPosition(800U, 0U);


    auto chk_julia = tgui::CheckBox::create();
    gui.add(chk_julia);
    chk_julia->setSize(24,24);
    chk_julia->setPosition(810,20);
    chk_julia->getRenderer()->setTextColor(sf::Color(255,255,255,255));
    chk_julia->setText("Julia");
    chk_julia->setChecked(false);
    chk_julia->setTextClickable(true);
    chk_julia->onChange([](bool checked){
        if (checked)
            options::julia=true;
        else
           options::julia=false;
    });

    auto chk_anti = tgui::CheckBox::create();
    gui.add(chk_anti);
    chk_anti->setSize(24,24);
    chk_anti->setPosition(810,50);
    chk_anti->getRenderer()->setTextColor(sf::Color(255,255,255,255));
    chk_anti->setText("Anti");
    chk_anti->setChecked(false);
    chk_anti->setTextClickable(true);
    chk_anti->onChange([](bool checked){
        if (checked)
            options::anti=true;
        else
           options::anti=false;
    });


    auto spc_alpha = tgui::SpinControl::create();
    gui.add(spc_alpha);
    spc_alpha->setSize(70,24);
    spc_alpha->setPosition(810,80);
    spc_alpha->setMinimum(0);
    spc_alpha->setMaximum(100);
    spc_alpha->setStep(1);
    spc_alpha->setValue(100);
    spc_alpha->setDecimalPlaces(3);
    spc_alpha->onValueChange([](float value){
        options::alpha=value/100.0f;
    });

    auto lab_alpha = tgui::Label::create();
    gui.add(lab_alpha);
    lab_alpha->setText("% Alpha");
    lab_alpha->setPosition(880,85);
    lab_alpha->getRenderer()->setTextColor(sf::Color(255,255,255,255));


    auto spc_voxRes = tgui::SpinControl::create();
    gui.add(spc_voxRes);
    spc_voxRes->setSize(70,24);
    spc_voxRes->setPosition(810,110);
    spc_voxRes->setMinimum(0);
    spc_voxRes->setMaximum(100);
    spc_voxRes->setStep(0.1f);
    spc_voxRes->setValue(3.0f);
    spc_voxRes->setDecimalPlaces(3);
    spc_voxRes->onValueChange([](float value){
        options::voxRes=value;
    });

    auto lab_voxRes = tgui::Label::create();
    gui.add(lab_voxRes);
    lab_voxRes->setText("Voxel Resolution");
    lab_voxRes->setPosition(880,115);
    lab_voxRes->getRenderer()->setTextColor(sf::Color(255,255,255,255));



    auto spc_maxTrace = tgui::SpinControl::create();
    gui.add(spc_maxTrace);
    spc_maxTrace->setSize(70,24);
    spc_maxTrace->setPosition(810,140);
    spc_maxTrace->setMinimum(0);
    spc_maxTrace->setMaximum(10000);
    spc_maxTrace->setStep(1);
    spc_maxTrace->setValue(500);
    spc_maxTrace->setDecimalPlaces(0);
    spc_maxTrace->onValueChange([](float value){
        options::maxTrace=int(value);
    });

    auto lab_maxTrace = tgui::Label::create();
    gui.add(lab_maxTrace);
    lab_maxTrace->setText("Max Trace");
    lab_maxTrace->setPosition(880,145);
    lab_maxTrace->getRenderer()->setTextColor(sf::Color(255,255,255,255));



    std::thread renderer (render::renders);
    auto mouse_position = sf::Vector2f{};


    while (window.isOpen())
    {
        for (auto event = sf::Event{}; window.pollEvent(event);)
        {
            gui.handleEvent(event);
            if (event.type == sf::Event::Closed)
            {
                window.close();
            }
            else if (event.type == sf::Event::MouseMoved)
            {
                mouse_position = window.mapPixelToCoords({ event.mouseMove.x, event.mouseMove.y });
            }
        }



        t++;
        std::string xpath= utils::GetExeDirectory()+"/data/test/a_"+std::string(4 - std::min(4, (int)(std::to_string(t)).length()), '0') + std::to_string(t)+".png";
        //renderTexture.getTexture().copyToImage().saveToFile(xpath);
       // while(!render::ready){}


        //renderTexture.resetGLStates();

        if(render::changed){
            render::changed=false;
            texture.loadFromImage(render::image);
        }

        sf::Sprite sprite=sf::Sprite(texture);
        sprite.setPosition(0U,0U);
        window.clear();
        window.draw(opt_back);
         window.draw(sprite);
         gui.draw();
        window.display();
       // if(t>=200)return(0);
    }}
