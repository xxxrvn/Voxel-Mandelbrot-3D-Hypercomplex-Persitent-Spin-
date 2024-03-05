#ifndef RENDER_H
#define RENDER_H
#include <SFML/Graphics.hpp>


class render
{
    public:

       static void renders();

       static bool ready;
       static bool changed;
       static sf::Image image;
};

#endif // RENDER_H
